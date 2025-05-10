import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { updateRequestStatus } from "@/app/actions"

interface RequestDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  request: any
  onStatusUpdate: () => void
}

export default function RequestDetailsModal({
  isOpen,
  onClose,
  request,
  onStatusUpdate,
}: RequestDetailsModalProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [declineReason, setDeclineReason] = useState("")
  const [showDeclineReason, setShowDeclineReason] = useState(false)

  if (!request) return null

  const canUpdateStatus = request.status !== "declined" && request.status !== "completed"

  const handleStatusUpdate = async (newStatus: string) => {
    if (!canUpdateStatus) return

    if (newStatus === "declined" && !showDeclineReason) {
      setShowDeclineReason(true)
      return
    }

    try {
      setIsUpdating(true)
      const result = await updateRequestStatus(
        request.id,
        newStatus,
        newStatus === "declined" ? declineReason : undefined
      )

      if (result.success) {
        toast.success("Request status updated successfully")
        onStatusUpdate()
        onClose()
      } else {
        toast.error(result.error || "Failed to update request status")
      }
    } catch (error) {
      toast.error("An error occurred while updating the request status")
    } finally {
      setIsUpdating(false)
      setShowDeclineReason(false)
      setDeclineReason("")
    }
  }

  const getAvailableStatusUpdates = () => {
    switch (request.status?.toLowerCase()) {
      case "pending":
        return (
          <div className="flex gap-2">
            <Button
              onClick={() => handleStatusUpdate("approved")}
              disabled={isUpdating}
              className="bg-green-500 hover:bg-green-600"
            >
              Approve
            </Button>
            <Button
              onClick={() => handleStatusUpdate("declined")}
              disabled={isUpdating}
              className="bg-red-500 hover:bg-red-600"
            >
              Decline
            </Button>
          </div>
        )
      case "approved":
        return (
          <div className="flex gap-2">
            <Button
              onClick={() => handleStatusUpdate("fulfilled")}
              disabled={isUpdating}
              className="bg-green-500 hover:bg-green-600"
            >
              Mark as Fulfilled
            </Button>
            <Button
              onClick={() => handleStatusUpdate("declined")}
              disabled={isUpdating}
              className="bg-red-500 hover:bg-red-600"
            >
              Decline
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-900 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white"
                >
                  Request Details
                </Dialog.Title>

                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="font-semibold text-white">Patient Information</h4>
                    <div className="mt-2 space-y-2 text-gray-300">
                      <p>Name: {request.patient?.user?.first_name} {request.patient?.user?.last_name}</p>
                      <p>Email: {request.patient?.user?.email}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white">Request Information</h4>
                    <div className="mt-2 space-y-2 text-gray-300">
                      <p>Blood Type: {request.blood_type}</p>
                      <p>Units Required: {request.units_required}</p>
                      <p>Request Date: {request.request_date}</p>
                      <p>Status: {request.status}</p>
                    </div>
                  </div>

                  {showDeclineReason && (
                    <div>
                      <h4 className="font-semibold text-white mb-2">Decline Reason</h4>
                      <Textarea
                        value={declineReason}
                        onChange={(e) => setDeclineReason(e.target.value)}
                        placeholder="Enter reason for declining the request..."
                        className="bg-gray-800 text-white border-gray-700"
                      />
                      <div className="flex gap-2 mt-2">
                        <Button
                          onClick={() => handleStatusUpdate("declined")}
                          disabled={isUpdating || !declineReason.trim()}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Confirm Decline
                        </Button>
                        <Button
                          onClick={() => setShowDeclineReason(false)}
                          variant="outline"
                          className="bg-gray-700 text-white hover:bg-gray-600"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {canUpdateStatus && !showDeclineReason && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-white mb-2">Update Status</h4>
                      {getAvailableStatusUpdates()}
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-gray-700 text-white hover:bg-gray-600"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
} 