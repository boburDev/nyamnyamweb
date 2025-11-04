import { Link } from "@/i18n/navigation"
import { Container } from "../container"
import { Button } from "../ui/button"
import { UserIcon } from "@/assets/icons"
import { PageHeader } from "../header"
import { getTranslations } from "next-intl/server"

const ProfilePageServer = async () => {
    const t = await getTranslations("profile.profile-logout");
    return (
        <Container>
            <PageHeader title="Profile" />
            <div className="bg-white rounded-[15px] p-2.5 mt-7.5">
                <h1 className="font-semibold text-[18px] text-textColor">{t("loginTitle")}</h1>
                <h3 className="text-sm text-dolphin pt-[5px]">{t("loginSubtitle")}</h3>
                <div className="grid 2xs:grid-cols-2 gap-2 pt-[15px]">
                    <Link href={"https://business.azera.uz"} target="_blank">
                        <Button
                            variant="secondary"
                            className="w-full h-12 px-5 font-medium text-sm"
                        >
                            {t("businessButton")}
                        </Button>
                    </Link>

                    <Link href={"/signin"} className="flex">
                        <Button className="w-full h-12 px-5 font-medium text-sm">
                            <UserIcon />
                            {t("loginButton")}
                        </Button>
                    </Link>
                </div>
            </div>
        </Container>
    )
}

export default ProfilePageServer