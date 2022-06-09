import React from 'react';
import { Container } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useFunctions, useRefs } from '../hooks';
import { FullscreenWrapper } from '../wrappers';

// Custom imports:
import { Group, Image, Text } from '../components';
import ic_whatsapp from '../assets/icon/ic_whatsapp.svg';
import ic_instagram from '../assets/icon/ic_instagram.svg';
import ic_linkedin from '../assets/icon/ic_linkedin.svg';
import homemembershipsimage3_b39866af4602362dad5e5d321c3c1c23 from '../assets/img/homemembershipsimage3_b39866af4602362dad5e5d321c3c1c23.jpeg';
import homemembershipsimage2 from '../assets/img/homemembershipsimage2.jpeg';
import homemembershipsimage from '../assets/img/homemembershipsimage.jpeg';
import bannerright2 from '../assets/img/bannerright2.jpg';
import bannerright3 from '../assets/img/bannerright3.jpg';
import bannerright1 from '../assets/img/bannerright1.jpg';
import bannerleft from '../assets/img/bannerleft.jpg';
import logo from '../assets/img/logo.svg';
import { useTranslation } from 'react-i18next';

export const Home2View = () => {
  const { run } = useFunctions();
  // Custom exports:
	const { t } = useTranslation();

  // Custom functions:
	const homeFooterRightText2OnClick = (options) => {
		run([{"function":"popup","dialog":"cokkies_dialog"}], options)
	}
	const componhomeFooterLeftIconWhatsappOnClick = (options) => {
		run([{"function":"browser","url":"https:\/\/www.instagram.com\/"}], options)
	}
	const componhomeFooterLeftIconLinkedinOnClick = (options) => {
		run([{"function":"browser","url":"https:\/\/www.instagram.com\/"}], options)
	}
	const componhomeFooterLeftIconLinkedinOnClick = (options) => {
		run([{"function":"browser","url":"https:\/\/www.instagram.com\/"}], options)
	}

  return (
    <>
      <Helmet>
				<title>{t('Home2.title')}</title>
      </Helmet>
      <FullscreenWrapper>
          
			<Group
				id="homeBody"
				direction="vertical"
				className="w-100 min-h-100 fg-100 position-relative" >
				<Group
					id="homeHeader"
					direction="auto"
					className="w-100 h-auto position-relative px-16px py-48px" >
					<Image
						id="homeHeaderLogo"
						src={logo}
						className="w-230px h-auto position-relative pe-64px pt-32px" />
					<Group
						id="homeHeaderMenu"
						direction="auto"
						className="min-w-320px w-fill h-auto valign-center position-relative my-24px" >
						<Text
							id="homeHeaderMenuAbout"
							className="w-auto h-auto border-gray border-end position-relative pe-24px py-2px me-24px my-16px text-primary-text ff-textSemiBold" >
							{t('Home2.homeHeaderMenuAbout')}
						</Text>
						<Text
							id="homeHeaderTheHouse"
							className="w-auto h-auto border-gray border-end position-relative pe-24px py-2px me-24px my-16px text-primary-text ff-textSemiBold" >
							{t('Home2.homeHeaderTheHouse')}
						</Text>
						<Text
							id="homeHeaderMenuAbout"
							className="w-auto h-auto border-gray border-end position-relative pe-24px py-2px me-24px my-16px text-primary-text ff-textSemiBold" >
							{t('Home2.homeHeaderMenuAbout')}
						</Text>
						<Text
							id="homeHeaderMenuAbout1654738153162"
							className="w-auto h-auto border-gray position-relative pe-24px py-2px me-24px my-16px text-primary-text ff-textSemiBold" >
							{t('Home2.homeHeaderMenuAbout1654738153162')}
						</Text>
					</Group>
					<Group
						id="homeHeaderButtom"
						direction="horizontal"
						className="min-w-230px w-auto h-auto valign-center position-relative me-24px my-16px" >
						<Text
							id="homeHeaderButtom"
							className="w-auto h-auto position-relative pe-8px py-8px me-23px text-primary ff-regular" >
							{t('Home2.homeHeaderButtom')}
						</Text>
						<Text
							id="homeHeaderApplyButtom"
							className="w-auto h-auto border-radius-30px position-relative bg-primary px-16px py-8px text-white ff-regular" >
							{t('Home2.homeHeaderApplyButtom')}
						</Text>
					</Group>
				</Group>
				<Group
					id="homeBanner"
					direction="auto"
					className="w-fill min-h-100 fg-100 position-relative mb-60px" >
					<Group
						id="homeBannerLeft"
						direction="vertical"
						className="max-w-960px min-w-300px w-fill min-h-100 h-100 position-relative ps-8px py-8px" >
						<Image
							id="homeBannerImgLeft"
							src={bannerleft}
							className="w-fill min-h-100 fg-100 position-relative cover" />
						<Text
							id="homeBannerRightButtom"
							className="w-auto h-auto border-radius-50px align-end valign-end position-absolute-bottom bg-accent px-16px py-8px me-32px mb-32px text-white ff-regular" >
							{t('Home2.homeBannerRightButtom')}
						</Text>
					</Group>
					<Group
						id="homeBannerRight"
						direction="vertical"
						className="max-w-960px min-w-300px w-fill min-h-100 h-100 position-relative p-8px" >
						<Group
							id="homeBannerRightTop"
							direction="horizontal"
							className="w-100 h-auto position-relative" >
							<Image
								id="homeBannerImgLeftTop"
								src={bannerright1}
								className="w-100 h-auto position-relative cover" />
							<Text
								id="homeBannerRightTopButtom"
								className="w-auto h-auto border-radius-50px align-end valign-end position-absolute-bottom bg-accent px-16px py-8px me-32px mb-32px text-white ff-regular" >
								{t('Home2.homeBannerRightTopButtom')}
							</Text>
						</Group>
						<Group
							id="homeBannerRightBottom"
							direction="auto"
							className="w-100 h-fill position-relative" >
							<Group
								id="homeBannerRightBottomLeft"
								direction="vertical"
								className="max-w-400px min-w-300px w-fill min-h-100 h-100 position-relative pe-8px pt-8px" >
								<Image
									id="homeBannerRightBottomRight"
									src={bannerright3}
									className="w-100 h-fill position-relative cover" />
								<Text
									id="homeBannerRightButtom"
									className="w-auto h-auto border-radius-50px align-end valign-end position-absolute-bottom bg-accent px-16px py-8px me-32px mb-32px text-white ff-regular" >
									{t('Home2.homeBannerRightButtom')}
								</Text>
							</Group>
							<Group
								id="homeBannerRightBottomRight"
								direction="vertical"
								className="max-w-700px min-w-300px w-fill min-h-100 h-100 position-relative pt-8px" >
								<Image
									id="homeBannerRightBottomRight1654791859528"
									src={bannerright2}
									className="w-100 h-fill position-relative cover" />
								<Text
									id="homeBannerRightButtom1654792384328"
									className="w-auto h-auto border-radius-50px align-end valign-end position-absolute-bottom bg-accent px-16px py-8px me-32px mb-32px text-white ff-regular" >
									{t('Home2.homeBannerRightButtom1654792384328')}
								</Text>
							</Group>
						</Group>
					</Group>
				</Group>
				<Group
					id="homeHeaderMembership"
					direction="auto"
					className="w-fill min-h-100 fg-100 position-relative mb-200px" >
					<Text
						id="homeHeaderMembershipTitle"
						className="w-100 h-auto position-relative p-16px f-38px ff-regular" >
						{t('Home2.homeHeaderMembershipTitle')}
					</Text>
					<Group
						id="homeHeaderMembershipImg1"
						direction="horizontal"
						className="max-w-900px w-fill min-h-400px h-100 position-relative m-8px" >
						<Image
							id="homeHeaderMembershipImg1"
							src={homemembershipsimage}
							className="w-100 h-fill position-relative bg-primary-to-primary-dark cover" />
						<Text
							id="homeBannerRightButtom1654800600816"
							className="w-auto h-auto border-radius-50px align-center valign-end position-absolute-bottom bg-primary px-16px py-8px me-32px mb-32px text-white ff-regular" >
							{t('Home2.homeBannerRightButtom1654800600816')}
						</Text>
					</Group>
					<Group
						id="homeHeaderMembershipImg2"
						direction="auto"
						className="max-w-1100px w-fill min-h-100px h-100 position-relative m-8px" >
						<Group
							id="homeHeaderMembershipImg1"
							direction="vertical"
							className="max-w-510px min-w-100px w-fill min-h-100 h-100 position-relative m-8px" >
							<Image
								id="homeHeaderMembershipImg1654801891477"
								src={homemembershipsimage2}
								className="w-fill min-h-100 fg-100 position-relative bg-primary-to-primary-dark fill" />
							<Text
								id="homeBannerRightButtom1654801891477"
								className="w-auto h-auto border-radius-50px align-center valign-end position-absolute-bottom bg-primary px-16px py-8px me-32px mb-32px text-white ff-regular" >
								{t('Home2.homeBannerRightButtom1654801891477')}
							</Text>
						</Group>
						<Group
							id="homeHeaderMembershipImg2"
							direction="vertical"
							className="max-w-510px w-fill min-h-100 h-100 position-relative m-8px" >
							<Image
								id="homeHeaderMembershipImg1654801908424"
								src={homemembershipsimage3_b39866af4602362dad5e5d321c3c1c23}
								className="w-fill min-h-100 fg-100 position-relative bg-primary-to-primary-dark cover" />
							<Text
								id="homeBannerRightButtom1654801908424"
								className="w-auto h-auto border-radius-50px align-center valign-end position-absolute-bottom bg-primary px-16px py-8px me-32px mb-32px text-white ff-regular" >
								{t('Home2.homeBannerRightButtom1654801908424')}
							</Text>
						</Group>
					</Group>
				</Group>
				<Group
					id="homeHeaderNews"
					direction="vertical"
					className="w-100 min-h-500px h-500px position-relative" >
				</Group>
				<Group
					id="homeFooter"
					direction="auto"
					className="w-100 h-auto position-relative bg-lightgrey" >
					<Group
						id="homeFooterLeft"
						direction="vertical"
						className="min-w-320px w-fill h-auto position-relative ps-16px pe-48px pt-16px pb-48px" >
						<Image
							id="homeFooterLeftLogo"
							src={logo}
							className="w-167px h-auto position-relative pt-20px pb-10px" />
						<Text
							id="homeFooterLeftText"
							className="w-100 h-auto position-relative ff-ralewaymedium" >
							{t('Home2.homeFooterLeftText')}
						</Text>
						<Group
							id="homeFooterLeftIcon"
							direction="horizontal"
							className="w-100 h-auto position-relative mt-72px" >
							<Image
								id="componhomeFooterLeftIconLinkedin"
								onClick={componhomeFooterLeftIconLinkedinOnClick}
								src={ic_linkedin}
								className="w-60px h-auto position-relative" />
							<Image
								id="componhomeFooterLeftIconLinkedin"
								onClick={componhomeFooterLeftIconLinkedinOnClick}
								src={ic_instagram}
								className="w-60px h-auto position-relative ms-24px" />
							<Image
								id="componhomeFooterLeftIconWhatsapp"
								onClick={componhomeFooterLeftIconWhatsappOnClick}
								src={ic_whatsapp}
								className="w-60px h-auto position-relative ms-24px" />
						</Group>
					</Group>
					<Group
						id="homeFooterRight"
						direction="vertical"
						className="max-w-400px w-fill h-auto position-relative ps-16px pe-48px pt-16px pb-48px mt-24px" >
						<Text
							id="homeFooterRightText"
							className="w-100 h-auto position-relative mb-32px ff-ralewaybold" >
							{t('Home2.homeFooterRightText')}
						</Text>
						<Text
							id="homeFooterRightText2"
							onClick={homeFooterRightText2OnClick}
							className="w-100 h-auto position-relative mb-32px ff-ralewaymedium" >
							{t('Home2.homeFooterRightText2')}
						</Text>
						<Text
							id="homeFooterRightText3"
							className="w-100 h-auto position-relative mb-32px ff-ralewaymedium" >
							{t('Home2.homeFooterRightText3')}
						</Text>
						<Group
							id="homeFooterRightText4"
							direction="vertical"
							className="w-100 h-auto position-relative mt-32px" >
							<Text
								id="homeFooterRightTextGroup"
								className="w-100 h-auto position-relative" >
								{t('Home2.homeFooterRightTextGroup')}
							</Text>
							<Text
								id="homeFooterRightTextGroup1"
								className="w-100 h-auto position-relative" >
								{t('Home2.homeFooterRightTextGroup1')}
							</Text>
						</Group>
					</Group>
				</Group>
				<Group
					id="homeFooterButtom"
					direction="vertical"
					className="w-100 min-h-8px h-8px position-relative bg-primary" >
				</Group>
			</Group>
      </FullscreenWrapper>
    </>
  );
};
