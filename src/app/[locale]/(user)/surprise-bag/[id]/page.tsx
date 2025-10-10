interface Props {
  params: Promise<{ id: string }>;
}
const SurpriseBagSinglePage = async ({ params }: Props) => {
  const { id } = await params;

  return <div>page {id}</div>;
};

export default SurpriseBagSinglePage;
