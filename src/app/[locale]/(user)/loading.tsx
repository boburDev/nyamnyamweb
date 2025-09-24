import { Container } from "@/components/container";
import { BannerSkeleton, PageLoader, ProductSkeletonGrid } from "@/components/loader";
import TabsLoader from "@/components/loader/TabsLoader";

const LoadingPage = () => {
  return <>
    <PageLoader />
    <div className="mt-20">
      <BannerSkeleton />
    </div>
    <Container className="mt-30">
      <TabsLoader />
      <div className="mt-25">
        <ProductSkeletonGrid count={8} />
      </div>
    </Container>
  </>;
};

export default LoadingPage;
