import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"

interface RequestDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  request: any
}

export default function RequestDetailsModal({
  isOpen,
  onClose,
  request,
}: RequestDetailsModalProps) {
  if (!request) return null

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
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
} 