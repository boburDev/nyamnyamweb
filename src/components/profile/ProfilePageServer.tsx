import { Link } from "@/i18n/navigation"
import { Container } from "../container"
import { Button } from "../ui/button"
import { UserIcon } from "@/assets/icons"

const ProfilePageServer = () => {
    return (
        <Container>
            <div className="bg-white rounded-[15px] p-2.5">
                <h1 className="font-semibold text-[18px] text-textColor">Hisobingizga kiring</h1>
                <h3 className="text-sm text-dolphin pt-[5px]">Mazali ovqatlar va foydali takliflarni qo‘ldan boy bermang</h3>
                <div className="grid grid-cols-2 gap-2 pt-[15px]">
                    <Link href={"https://business.azera.uz"} target="_blank">
                        <Button
                            variant="secondary"
                            className="w-full h-12 px-5 font-medium text-sm"
                        >
                            Biznes uchun kirish
                        </Button>
                    </Link>


                    <Link href={"/signin"} className="flex">
                        <Button className="w-full h-12 px-5 font-medium text-sm">
                            <UserIcon />
                            Kirish
                        </Button>
                    </Link>
                </div>
            </div>
        </Container>
    )
}

export default ProfilePageServer