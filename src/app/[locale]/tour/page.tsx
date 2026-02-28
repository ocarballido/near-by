import React from 'react';
import { useTranslations } from 'next-intl';

import Image from 'next/image';

import headerImage from '../../../../public/static/img/header-trimed-2x.webp';
import headerImageMobile from '../../../../public/static/img/heroMobile.webp';
import rooftopCentered from '../../../../public/static/img/rooftop-centered.png';
import multyProperty from '../../../../public/static/img/multy-property-2x.webp';
import blur from '../../../../public/static/img/home/blur.webp';
import why from '../../../../public/static/img/home/why_bnbexplorer.webp';
import how from '../../../../public/static/img/home/how_bnbexplorer.webp';

import categories from '../../../../public/static/img/categories-2x.webp';
import uiEdit from '../../../../public/static/img/ui-edit-2x.webp';
import publicUi from '../../../../public/static/img/public-ui-2x.webp';
import testimony01 from '../../../../public/static/img/testimony-01.webp';
import testimony02 from '../../../../public/static/img/testimony-02.webp';
import testimony03 from '../../../../public/static/img/testimony-03.webp';

import LandingAppBar from '@/components/organisms/landing-appbar';
import ButtonLink from '@/components/molecules/button-link';
import PlaceTooltip from '@/components/atoms/place-tooltip';
import IconAccountCircle from '@/components/atoms/icon/account-circle';
import FilterCategories from '@/components/templates/filter-categories';
import ChimneyEffect from '@/components/atoms/chimney';

import IconChatBubble from '@/components/atoms/icon/chat-bubble';
import IconStarShine from '@/components/atoms/icon/star-shine';
import IconCheckCircle from '@/components/atoms/icon/check-circle';
import IconFavorite from '@/components/atoms/icon/favorite';
import IconInterests from '@/components/atoms/icon/interests';

import Feature from '@/components/molecules/card/feature';
import ListItem from '@/components/molecules/list-item';
import FancyBadge from '@/components/atoms/fancy-badge';
import BadgeCheck from '@/components/atoms/BadgeCheck';
import IconCancel from '@/components/atoms/icon/cancel';
import Quote from '@/components/molecules/quote';
import SupademoShowcaseEmbed from '@/components/organisms/supademo-tour';
import SupademoDemoViewer from '@/components/organisms/supademo/viewer';

const demos = [
	{
		id: 'dashboard',
		label: 'dashboard',
		embedUrl:
			'https://app.supademo.com/embed/cmm3vtqhb0sy7dtfh7rz6i52n?embed_v=2&utm_source=embed',
		publicUrl: 'https://app.supademo.com/demo/cmm3vtqhb0sy7dtfh7rz6i52n',
	},
	{
		id: 'add-property',
		label: 'addProperty',
		embedUrl:
			'https://app.supademo.com/embed/cmm4sqa9w272ydtfhzz8rjhvc?embed_v=2&utm_source=embed',
		publicUrl:
			'https://app.supademo.com/demo/cmm4sqa9w272ydtfhzz8rjhvc?utm_source=link',
	},
	{
		id: 'my-properties',
		label: 'myProperties',
		embedUrl:
			'https://app.supademo.com/embed/cmm3wjcoq0u3idtfhtv2idlrk?embed_v=2&utm_source=embed',
		publicUrl:
			'https://app.supademo.com/demo/cmm3wjcoq0u3idtfhtv2idlrk?utm_source=link',
	},
	{
		id: 'edit-properties',
		label: 'editProperties',
		embedUrl:
			'https://app.supademo.com/embed/cmm3x6aao0uy5dtfhz5tj67t3?embed_v=2&utm_source=embed',
		publicUrl:
			'https://app.supademo.com/demo/cmm3x6aao0uy5dtfhz5tj67t3?utm_source=link',
	},
	{
		id: 'edit-property-details',
		label: 'editPropertDetails',
		embedUrl:
			'https://app.supademo.com/embed/cmm4wj2rg2drndtfhvgm858hr?embed_v=2&utm_source=embed',
		publicUrl:
			'https://app.supademo.com/demo/cmm4wj2rg2drndtfhvgm858hr?utm_source=link',
	},
	{
		id: 'edit-property-info',
		label: 'editPropertyInfo',
		embedUrl:
			'https://app.supademo.com/embed/cmm4rcg6b23g5dtfh7u2kdzn0?embed_v=2&utm_source=embed',
		publicUrl:
			'https://app.supademo.com/demo/cmm4rcg6b23g5dtfh7u2kdzn0?utm_source=link',
	},
	{
		id: 'add-location',
		label: 'addLocation',
		embedUrl:
			'https://app.supademo.com/embed/cmm4ry8ng25txdtfh72jw1p8u?embed_v=2&utm_source=embed',
		publicUrl:
			'https://app.supademo.com/demo/cmm4ry8ng25txdtfh72jw1p8u?utm_source=link',
	},
	{
		id: 'favorites-must-see',
		label: 'favoritesMustSee',
		embedUrl:
			'https://app.supademo.com/embed/cmm50p1dd2mdjdtfhhst9yfx3?embed_v=2&utm_source=embed',
		publicUrl:
			'https://app.supademo.com/demo/cmm50p1dd2mdjdtfhhst9yfx3?utm_source=link',
	},
	{
		id: 'add-multiple-locations',
		label: 'addMultipleLocations',
		embedUrl:
			'https://app.supademo.com/embed/cmm4vze4o2d3cdtfhafzau4o4?embed_v=2&utm_source=embed',
		publicUrl:
			'https://app.supademo.com/demo/cmm4vze4o2d3cdtfhafzau4o4?utm_source=link',
	},
	{
		id: 'delete-locations',
		label: 'deleteLocation',
		embedUrl:
			'https://app.supademo.com/embed/cmm4w8e0d2dcadtfh7rgmu7ao?embed_v=2&utm_source=embed',
		publicUrl:
			'https://app.supademo.com/demo/cmm4w8e0d2dcadtfh7rgmu7ao?utm_source=link',
	},
	{
		id: 'delete-property',
		label: 'deleteProperty',
		embedUrl:
			'https://app.supademo.com/embed/cmm4vrw9g2cwedtfho4o5yt1s?embed_v=2&utm_source=embed',
		publicUrl:
			'https://app.supademo.com/demo/cmm4vrw9g2cwedtfho4o5yt1s?utm_source=link',
	},
	{
		id: 'access-public-page',
		label: 'accessPublicProperty',
		embedUrl:
			'https://app.supademo.com/embed/cmm515aug2njpdtfh107t7orm?embed_v=2&utm_source=embed',
		publicUrl:
			'https://app.supademo.com/demo/cmm515aug2njpdtfh107t7orm?utm_source=link',
	},
	{
		id: 'public-page',
		label: 'publicProperty',
		embedUrl:
			'https://app.supademo.com/embed/cmm51r4jg2ozrdtfh35obkoem?embed_v=2&utm_source=embed',
		publicUrl:
			'https://app.supademo.com/demo/cmm51r4jg2ozrdtfh35obkoem?utm_source=link',
	},
];

export default function Tour() {
	const t = useTranslations();

	return (
		<div className="roboto p-4">
			<LandingAppBar />
			<section
				aria-labelledby="why"
				className="flex flex-col gap-8 rounded-lg mt-2 py-16 px-4 items-center max-w-[1400px] ml-auto mr-auto relative"
			>
				<SupademoDemoViewer demos={demos} defaultDemoId="dashboard" />
			</section>
		</div>
	);
}
