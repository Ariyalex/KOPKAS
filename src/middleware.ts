import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });
    const { data: { session } } = await supabase.auth.getSession();

    // Cek apakah URL adalah halaman yang dilindungi (user atau admin)
    const isUserProtected = req.nextUrl.pathname.startsWith('/user');
    const isAdminProtected = req.nextUrl.pathname.startsWith('/admin');

    // Jika tidak ada session dan mencoba mengakses halaman dilindungi, redirect ke login
    if ((isUserProtected || isAdminProtected) && !session) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Jika mencoba akses halaman admin, periksa apakah pengguna memiliki role admin
    if (isAdminProtected && session) {
        // Ambil data role user
        const { data: userData, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single();

        // Jika terjadi error atau pengguna bukan admin, redirect ke user dashboard
        if (error || userData?.role !== 'admin') {
            return NextResponse.redirect(new URL('/user', req.url));
        }
    }

    return res;
}

export const config = {
    matcher: ['/user/:path*', '/admin/:path*'],
};