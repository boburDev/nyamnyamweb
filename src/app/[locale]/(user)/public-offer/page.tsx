import { Container } from "@/components/container";
import { getTranslations } from "next-intl/server";

export default async function PublicOfferPage() {
  const t = await getTranslations("public-offer");

  return (
    <div className="py-10 md:py-20">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-semibold text-textColor mb-[15px]">
              {t("title")}
            </h1>
            <p className="text-lg md:text-2xl font-medium text-textColor mb-[50px]">
              {t("description")}
            </p>
            <p className="text-xl font-medium text-start text-textColor">
              {t("city")}
            </p>
            <p className="text-xl font-medium text-start text-textColor">
              {t("last-update")}
            </p>
          </div>

          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-center text-textColor mb-[30px]">
              {t("section1.title")}
            </h2>
            <div className="space-y-4 text-textColor">
              <p>{t("section1.item1_1")}</p>
              <p>{t("section1.item1_2")}</p>
              <p>{t("section1.item1_3")}</p>
              <p>{t("section1.item1_4")}</p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-center text-textColor mb-[30px]">
              {t("section2.title")}
            </h2>
            <div className="space-y-4 text-textColor">
              <p><strong>{t("section2.service")}</strong></p>
              <p><strong>{t("section2.surpriseBox")}</strong></p>
              <p><strong>{t("section2.user")}</strong></p>
              <p><strong>{t("section2.supplier")}</strong></p>
              <p><strong>{t("section2.order")}</strong></p>
              <p><strong>{t("section2.operator")}</strong></p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-center text-textColor mb-[30px]">
              {t("section3.title")}
            </h2>
            <div className="space-y-4 text-textColor">
              <p>{t("section3.item3_1")}</p>
              <p>{t("section3.item3_2")}</p>
              <p>{t("section3.item3_3")}</p>
              <p>{t("section3.item3_4")}</p>
              <p>{t("section3.item3_5")}</p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-center text-textColor mb-[30px]">
              {t("section4.title")}
            </h2>
            <div className="space-y-4 text-textColor">
              <p>{t("section4.item4_1")}</p>
              <p>{t("section4.item4_2")}</p>
              <p>{t("section4.item4_3")}</p>
              <p>{t("section4.item4_4")}</p>
              <p>{t("section4.item4_5")}</p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-center text-textColor mb-[30px]">
              {t("section5.title")}
            </h2>
            <div className="space-y-4 text-textColor">
              <p>{t("section5.item5_1")}</p>
              <p>{t("section5.item5_2")}</p>
              <p>{t("section5.item5_3")}</p>
              <p>{t("section5.item5_4")}</p>
              <p>{t("section5.item5_5")}</p>
              <p>{t("section5.item5_6")}</p>
              <p>{t("section5.item5_7")}</p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-center text-textColor mb-[30px]">
              {t("section6.title")}
            </h2>
            <div className="space-y-6 text-textColor">
              <div>
                <h3 className="font-semibold text-textColor mb-2">
                  {t("section6.userObligations.title")}
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  {t.raw("section6.userObligations.items").map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-textColor mb-2">
                  {t("section6.userRights.title")}
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  {t.raw("section6.userRights.items").map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-textColor mb-2">
                  {t("section6.partnerObligations.title")}
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  {t.raw("section6.partnerObligations.items").map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-textColor mb-2">
                  {t("section6.azeraObligations.title")}
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  {t.raw("section6.azeraObligations.items").map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-center text-textColor mb-[30px]">
              {t("section7.title")}
            </h2>
            <div className="space-y-4 text-textColor">
              <p>{t("section7.item7_1")}</p>
              <p>{t("section7.item7_2")}</p>
              <p>{t("section7.item7_3")}</p>
              <p>{t("section7.item7_4")}</p>
              <p>{t("section7.item7_5")}</p>
              <p>{t("section7.item7_6")}</p>
              <p>{t("section7.item7_7")}</p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-center text-textColor mb-[30px]">
              {t("section8.title")}
            </h2>
            <div className="space-y-4 text-textColor">
              <p>{t("section8.item8_1")}</p>
              <p>{t("section8.item8_2")}</p>
              <p>{t("section8.item8_3")}</p>
              <p>{t("section8.item8_4")}</p>
              <p>{t("section8.item8_5")}</p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-center text-textColor mb-[30px]">
              {t("section9.title")}
            </h2>
            <div className="space-y-4 text-textColor">
              <p>{t("section9.item9_1")}</p>
              <p>{t("section9.item9_2")}</p>
              <p>{t("section9.item9_3")}</p>
            </div>
          </section>

          {/* Section 10 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-center text-textColor mb-[30px]">
              {t("section10.title")}
            </h2>
            <div className="space-y-4 text-textColor">
              <p>{t("section10.item10_1")}</p>
              <p>{t("section10.item10_2")}</p>
              <p>{t("section10.item10_3")}</p>
              <p>{t("section10.item10_4")}</p>
            </div>
          </section>

          {/* Section 11 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-center text-textColor mb-[30px]">
              {t("section11.title")}
            </h2>
            <div className="space-y-4 text-textColor">
              <p>{t("section11.item11_1")}</p>
              <p>{t("section11.item11_2")}</p>
              <p>{t("section11.item11_3")}</p>
              <p>{t("section11.item11_4")}</p>
            </div>
          </section>

          {/* Section 12 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-center text-textColor mb-[30px]">
              {t("section12.title")}
            </h2>
            <div className="space-y-4 text-textColor">
              <p>{t("section12.item12_1")}</p>
              <p>{t("section12.item12_2")}</p>
              <p>{t("section12.item12_3")}</p>
              <p>{t("section12.item12_4")}</p>
              <p>{t("section12.item12_5")}</p>
              <p>{t("section12.item12_6")}</p>
              <p>{t("section12.item12_7")}</p>
            </div>
          </section>

          {/* Section 13 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-center text-textColor mb-[30px]">
              {t("section13.title")}
            </h2>
            <div className="space-y-2 text-textColor">
              <p>{t("section13.companyName")}</p>
              <p>{t("section13.director")}</p>
              <p>{t("section13.address")}</p>
              <p>{t("section13.bank")}</p>
              <p>{t("section13.account")}</p>
              <p>{t("section13.tin")}</p>
              <p>{t("section13.oked")}</p>
              <p>{t("section13.okonh")}</p>
              <p>{t("section13.bankCode")}</p>
              <p>{t("section13.supportPhone")}</p>
              <div className="flex items-center gap-2">
                <p>{t("section13.email")}</p><a href="mailto:azerauzb@gmail.com">azerauzb@gmail.com</a>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
