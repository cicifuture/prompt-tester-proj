import { useState, useEffect } from "react";
import { MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import { SideNav } from "../layout/side-nav";
import { NavItems } from "../constants/side-nav";

export const MobileSidebar = () => {
    const [open, setOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <div className="flex items-center justify-center gap-2">
                        <MenuIcon />
                        <h1 className="text-lg font-semibold">Prompt Tester</h1>
                    </div>
                </SheetTrigger>
                <SheetContent side="top" className="w-full">
                    <div className="px-1 pt-6">
                        <SideNav items={NavItems} setOpen={setOpen} />
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
};