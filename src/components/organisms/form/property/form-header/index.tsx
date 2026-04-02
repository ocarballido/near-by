'use client';

import Modal from '@/components/organisms/modal';
import Typography from '@/components/atoms/typography';
import FancyIcon from '@/components/atoms/icon/fancy-icon';
import IconAdd from '@/components/atoms/icon/add';
import IconEdit from '@/components/atoms/icon/edit';
import ButtonIcon from '@/components/atoms/button-icon';
import IconInfo from '@/components/atoms/icon/info';

type Tip = {
	id: number;
	title: string;
	subtitle: string;
};

type Props = {
	// Modo
	isEdit: boolean;

	// Textos
	title: string;
	modalTitle: string;
	primaryButtonLabel: string;

	// Estado modal
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;

	// Contenido tips (solo create)
	tips: Tip[];

	// Traducción (para t(tip.title) / t(tip.subtitle))
	t: (key: string) => string;
};

export default function PropertyFormHeader({
	isEdit,
	title,
	modalTitle,
	primaryButtonLabel,
	isOpen,
	onOpen,
	onClose,
	tips,
	t,
}: Props) {
	return (
		<>
			{/* Modal solo en create */}
			{!isEdit && (
				<Modal
					title={modalTitle}
					open={isOpen}
					onClose={onClose}
					primaryButtonAction={onClose}
					primaryButtonLabel={primaryButtonLabel}
					size="max-w-3xl"
				>
					<div className="rounded-lg bg-primary-100 p-4 text-sm text-primary-800 font-medium text-left">
						{t('address_hint')}
					</div>
					<div className="flex flex-wrap max-w-[1000px]">
						{tips.map((tip) => (
							<div
								key={tip.id}
								className="flex flex-col w-full md:w-full lg:w-1/2 xl:w-1/3 gap-1 p-4 items-center text-center"
							>
								<div className="flex justify-center items-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF6B06]/10 to-[#31C48D]/10">
									<span className="flex justify-center items-center w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF6B06] to-[#31C48D] font-bold text-white text-base">
										{tip.id}
									</span>
								</div>
								<Typography component="h3" size="base">
									{t(tip.title)}
								</Typography>
								<Typography size="sm">
									{t(tip.subtitle)}
								</Typography>
							</div>
						))}
					</div>
				</Modal>
			)}

			<div className="rounded-lg p-3 pt-0 flex flex-col gap-2 items-center text-center">
				<FancyIcon
					icon={
						!isEdit ? (
							<IconAdd color="white" />
						) : (
							<IconEdit color="white" />
						)
					}
					color="gradient"
				/>
				<Typography
					component="h2"
					size="lg"
					className="flex items-center gap-1"
				>
					{title}

					{!isEdit && (
						<ButtonIcon
							size="small"
							icon={<IconInfo />}
							onClick={onOpen}
						/>
					)}
				</Typography>
			</div>
		</>
	);
}
