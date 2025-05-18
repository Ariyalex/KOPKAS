import Link from "next/link";

export function HeaderHome() {
    return (
        <div className="flex items-center flex-row px-20 py-2 justify-between w-full h-fit z-50 top-0">
            <div className="flex items-center">
                <Link className="font-bold text-[40px]" href="/">KOPKAS</Link>
            </div>
            <div>
                <ul className="flex flex-row items-center gap-10 px-4 py-3">
                    <Link className="text-2xl" href="/user">DAFTAR</Link>
                    <Link className="bg-[#C4DADA] font-bold text-2xl px-4 py-3 border-white border-[1px]" href="/login">MASUK</Link>
                </ul>
            </div>
        </div>
    );
}