
"use client"

import Link from "next/link"
import { Bell, LogOut, MessageSquareQuote } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useAuth } from "@/context/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function Header() {
  const { currentUser, setCurrentUser } = useAuth()
  const router = useRouter()
  const { toast } = useToast();

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    if (res.ok) {
      setCurrentUser(null);
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push("/");
      router.refresh();
    } else {
      toast({ variant: "destructive", title: "Logout Failed" });
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <MessageSquareQuote className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg font-headline">QnA Hub</span>
        </Link>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {currentUser ? (
              <>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      <span className="absolute top-2 right-2.5 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                      </span>
                      <span className="sr-only">Toggle notifications</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Notifications</h4>
                        <p className="text-sm text-muted-foreground">
                          You have 2 unread messages.
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <div className="flex items-start space-x-4 rounded-md p-2 hover:bg-secondary">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="https://placehold.co/40x40/4CAF50/FFFFFF.png?text=JS" alt="John Smith" data-ai-hint="avatar" />
                            <AvatarFallback>JS</AvatarFallback>
                          </Avatar>
                          <div className="text-sm">
                            <p className="font-medium">John Smith</p>
                            <p className="text-muted-foreground">
                              Answered your question: "How to fetch data..."
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4 rounded-md p-2 hover:bg-secondary">
                           <Avatar className="h-8 w-8">
                            <AvatarImage src="https://placehold.co/40x40/F44336/FFFFFF.png?text=AR" alt="Alex Ray" data-ai-hint="avatar" />
                            <AvatarFallback>AR</AvatarFallback>
                          </Avatar>
                          <div className="text-sm">
                            <p className="font-medium">Alex Ray</p>
                            <p className="text-muted-foreground">
                              Mentioned you in a comment.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar>
                        <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} data-ai-hint="avatar" />
                        <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/profile/${encodeURIComponent(currentUser.name)}`}>
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
