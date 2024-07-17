"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type AlertModalProps = {
  triggerChildren: React.ReactNode;
  title: string;
  desc: string;
  cancelText: string;
  confirmText: string;
  confirmAction: () => void;
};

export default function AlertModal({ triggerChildren, title, desc, cancelText, confirmText, confirmAction }: AlertModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>{triggerChildren}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{desc}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={confirmAction}>{confirmText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
