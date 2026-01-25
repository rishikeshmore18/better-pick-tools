import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, CreditCard, Loader2 } from "lucide-react";

interface UserProfileDropdownProps {
  showManageBilling?: boolean;
  onManageBilling?: () => void;
  manageBillingLoading?: boolean;
}

const UserProfileDropdown = ({
  showManageBilling = false,
  onManageBilling,
  manageBillingLoading = false,
}: UserProfileDropdownProps) => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserEmail(session.user.email || null);
      }
      setLoading(false);
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserEmail(session.user.email || null);
      } else {
        setUserEmail(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const getInitials = (email: string | null): string => {
    if (!email) return "U";
    const parts = email.split("@")[0];
    if (parts.length >= 2) {
      return parts.substring(0, 2).toUpperCase();
    }
    return parts.charAt(0).toUpperCase();
  };

  const getDisplayName = (email: string | null): string => {
    if (!email) return "User";
    return email.split("@")[0];
  };

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  if (!userEmail) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 h-9 px-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-accent text-accent-foreground text-xs font-semibold">
              {getInitials(userEmail)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline-block text-sm font-medium text-foreground">
            {getDisplayName(userEmail)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{getDisplayName(userEmail)}</p>
            <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {showManageBilling && onManageBilling && (
          <>
            <DropdownMenuItem
              onClick={onManageBilling}
              disabled={manageBillingLoading}
              className="cursor-pointer"
            >
              {manageBillingLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="mr-2 h-4 w-4" />
              )}
              <span>Manage Billing</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileDropdown;
