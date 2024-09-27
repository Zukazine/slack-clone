import { Button } from "@/components/ui/button"
import { 
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog"
import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code"
import { useConfirm } from "@/hooks/use-confirm"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { DialogDescription } from "@radix-ui/react-dialog"
import { CopyIcon, RefreshCcw } from "lucide-react"
import { toast } from "sonner"

interface InviteModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  name: string
  joinCode: string
}

export const InviteModal = ({
  open,
  setOpen,
  name,
  joinCode
}: InviteModalProps) => {
  const workspaceId = useWorkspaceId()
  const [ConfirmDialog, confirm] = useConfirm(
    "Are your sure?",
    "This will deactivate the current invite code and generate a new one"
  )

  const { mutate, isPending } = useNewJoinCode()
  
  const handleNewCode= async () => {
    const ok = await confirm()

    if (!ok) return;
    
    mutate({
      workspaceId
    }, {
      onSuccess(data) {
        toast.success("Invite code regenerated")
      },
      onError() {
        toast.error("Failed to regenerate invite code")
      },
    })
  }

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`

    navigator.clipboard
      .writeText(inviteLink)
      .then(() => {
        toast.success("Invite link copy to clipboard")
      })
  }

  return (
    <>
      <ConfirmDialog>

      </ConfirmDialog>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite people to {name}</DialogTitle>
            <DialogDescription>Use the code below to invite people to yourworkspace</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-4 items-center justify-center py-10">
            <p className="text-4xl font-bold tracking-widest uppercase">
              {joinCode}
            </p>
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              Copy link
              <CopyIcon className="size-4 ml-2"/>
            </Button>
          </div>
          <div className="flex items-center justify-between w-full">
            <Button
              onClick={handleNewCode}
              variant="outline"
              size="default"
              disabled={isPending}
            >
              New Code
              <RefreshCcw className="size-4 ml-2"/>
            </Button>
            <DialogClose asChild>
              <Button variant="default" size="default">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}