import dynamic from "next/dynamic";

const OnboardingPage = dynamic(() => import("@/components/layouts/Onboarding"), { ssr: false });

export default OnboardingPage;


export const page = () => {
    return <OnboardingPage />;
}