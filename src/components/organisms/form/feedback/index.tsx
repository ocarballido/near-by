'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useRef, useEffect } from 'react';

import Alert from '@/components/molecules/alert';
import Button from '@/components/molecules/button';
import TextField from '@/components/molecules/text-field';
import Typography from '@/components/atoms/typography';
import IconHelp from '@/components/atoms/icon/help';
import FancyIcon from '@/components/atoms/icon/fancy-icon';
import { Select, SelectOption } from '@/components/molecules/select';

import { useLoading } from '@/lib/context/LoadingContext';
import { useGlobal } from '@/lib/context/GlobalContext';

import { createFeedback } from '@/app/actions/feedback/create-feedback';
import { trackClientEvent } from '@/lib/analytics/trackClient';

type SourceArea =
	| 'create_property'
	| 'create_location'
	| 'create_info'
	| 'dashboard'
	| 'subscription';

type ContextType = 'property' | 'location' | 'info' | 'none';
type Category = 'question' | 'suggestion' | 'unclear' | 'bug' | 'other';

type FormValues = {
	category: Category;
	message: string;
	user_email: string;
};

type Props = {
	sourceArea: SourceArea;
	contextType?: ContextType;
	contextId?: string;
	returnTo?: string;
};

export default function FeedbackForm({
	sourceArea,
	contextType,
	contextId,
	returnTo,
}: Props) {
	const t = useTranslations();
	const locale = useLocale();
	const router = useRouter();

	const { openLoading, closeLoading } = useLoading();
	const { user } = useGlobal();
	const distinctId = user?.id;

	const [alert, setAlert] = useState<{
		type: 'error' | 'success';
		message: string;
	} | null>(null);

	const [didSucceed, setDidSucceed] = useState(false);

	// para evitar dobles tracks
	const openedTrackedRef = useRef(false);

	// timeout de redirect (fino: limpiar al unmount)
	const redirectTimeoutRef = useRef<number | null>(null);
	useEffect(() => {
		return () => {
			if (redirectTimeoutRef.current) {
				window.clearTimeout(redirectTimeoutRef.current);
			}
		};
	}, []);

	const categoryOptions: SelectOption[] = useMemo(
		() => [
			{ value: 'question', label: t('feedback.type.options.question') },
			{
				value: 'suggestion',
				label: t('feedback.type.options.suggestion'),
			},
			{ value: 'unclear', label: t('feedback.type.options.unclear') },
			{ value: 'bug', label: t('feedback.type.options.bug') },
			{ value: 'other', label: t('feedback.type.options.other') },
		],
		[t],
	);

	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
		setError,
	} = useForm<FormValues>({
		defaultValues: {
			category: 'other',
			message: '',
			user_email: '',
		},
	});

	// ✅ Track open (1 vez)
	useEffect(() => {
		if (!distinctId) return;
		if (openedTrackedRef.current) return;
		openedTrackedRef.current = true;

		trackClientEvent({
			event: 'feedback_opened',
			distinctId,
			props: {
				source_area: sourceArea,
				context_type: contextType ?? 'none',
				context_id: contextId ?? undefined,
				page_path: returnTo ?? undefined,
				locale,
			},
		});
	}, [distinctId, sourceArea, contextType, contextId, returnTo, locale]);

	const onCancel = () => {
		if (distinctId) {
			trackClientEvent({
				event: 'feedback_cancelled',
				distinctId,
				props: {
					source_area: sourceArea,
					context_type: contextType ?? 'none',
					context_id: contextId ?? undefined,
					page_path: returnTo ?? undefined,
					locale,
				},
			});
		}

		if (returnTo) router.replace(returnTo);
		else router.back();
	};

	const onSubmit: SubmitHandler<FormValues> = async (data) => {
		if (!data.message?.trim()) {
			setError('message', {
				type: 'manual',
				message: t('feedback.validation.messageRequired'),
			});
			return;
		}

		const fd = new FormData();
		fd.append('category', data.category);
		fd.append('message', data.message.trim());
		fd.append('source_area', sourceArea);
		fd.append('context_type', contextType ?? 'none');
		fd.append('locale', locale);

		if (contextId) fd.append('context_id', contextId);
		if (returnTo) fd.append('page_path', returnTo);
		if (data.user_email?.trim())
			fd.append('user_email', data.user_email.trim());

		openLoading();
		const result = await createFeedback(fd);
		closeLoading();

		if (result?.errors) {
			if (distinctId) {
				trackClientEvent({
					event: 'feedback_submit_failed',
					distinctId,
					props: {
						source_area: sourceArea,
						context_type: contextType ?? 'none',
						has_context_id: Boolean(contextId),
						has_email: Boolean(data.user_email?.trim()),
					},
				});
			}

			setAlert({
				type: 'error',
				message:
					result.errors.server?.join(', ') ??
					t('feedback.alerts.genericServerError'),
			});
			return;
		}

		if (distinctId) {
			trackClientEvent({
				event: 'feedback_submitted',
				distinctId,
				props: {
					source_area: sourceArea,
					context_type: contextType ?? 'none',
					context_id: contextId ?? undefined,
					category: data.category,
					has_email: Boolean(data.user_email?.trim()),
					message_length: data.message.trim().length,
					page_path: returnTo ?? undefined,
					locale,
				},
			});
		}

		setAlert({
			type: 'success',
			message: t('feedback.alerts.successMessage'),
		});

		setDidSucceed(true);
		reset();

		const dest =
			returnTo && returnTo.startsWith('/app') ? returnTo : '/app';

		redirectTimeoutRef.current = window.setTimeout(() => {
			router.replace(dest);
		}, 1200);
	};

	return (
		<div className="bg-white p-2 rounded-xl max-w-[400px] w-full shadow-xs flex flex-col gap-4">
			<div className="rounded-lg p-3 pt-0 flex flex-col gap-2 items-center">
				<FancyIcon icon={<IconHelp color="white" />} color="gradient" />
				<Typography component="h2" size="lg">
					{t('feedback.title')}
				</Typography>
			</div>

			{alert && (
				<Alert
					type={alert.type}
					title={
						alert.type === 'error'
							? t('feedback.alerts.errorTitle')
							: t('feedback.alerts.successTitle')
					}
					message={alert.message}
					open={!!alert}
					hideTime={2500}
					dismissible
				/>
			)}

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-4 p-2"
			>
				<Typography component="p">{t('feedback.subtitle')}</Typography>
				<Controller
					name="category"
					control={control}
					rules={{ required: t('feedback.validation.typeRequired') }}
					render={({ field }) => (
						<Select
							label={t('feedback.type.label')}
							options={categoryOptions}
							value={field.value}
							onChange={field.onChange}
							name="category"
							error={!!errors.category}
							helperText={errors.category?.message}
							placeholder={t('feedback.type.placeholder')}
						/>
					)}
				/>

				<div className="flex flex-col gap-1">
					<label htmlFor="message" className="font-bold text-sm">
						{t('feedback.message.label')}
					</label>

					<textarea
						id="message"
						className={[
							'w-full rounded-md border p-3 text-sm',
							errors.message
								? 'border-red-500'
								: 'border-gray-200',
							'focus:outline-none focus:ring-0 focus:border-gray-300',
						].join(' ')}
						placeholder={t('feedback.message.placeholder')}
						{...register('message', {
							required: t('feedback.validation.messageRequired'),
							validate: (v) =>
								v.trim().length > 0 ||
								t('feedback.validation.messageRequired'),
						})}
					/>

					{errors.message?.message && (
						<p className="text-xs text-red-500">
							{errors.message.message}
						</p>
					)}
				</div>

				<TextField
					label={t('feedback.email.label')}
					placeholder={t('feedback.email.placeholder')}
					id="user_email"
					{...register('user_email', {
						validate: (v) => {
							const value = v.trim();
							if (!value) return true;
							return (
								/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
								t('feedback.validation.emailInvalid')
							);
						},
					})}
					error={Boolean(errors.user_email)}
					helperText={errors.user_email?.message}
				/>

				<div className="flex flex-col gap-2 mt-2">
					<Button
						type="submit"
						label={t('feedback.actions.submit')}
						disabled={isSubmitting || didSucceed}
						className="w-full"
					/>
					<Button
						type="button"
						label={t('feedback.actions.cancel')}
						color="secondary"
						onClick={onCancel}
						className="w-full"
						disabled={didSucceed}
					/>
				</div>
			</form>
		</div>
	);
}
