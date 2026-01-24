import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onOpenChange }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogTitle>Sign In Required</DialogTitle>
      <DialogDescription>
        Please sign in or sign up to continue.
      </DialogDescription>
      {/* Demo login buttons or forms would go here */}
      <div className="flex gap-2 mt-4">
        <button
          className="btn btn-primary w-full"
          onClick={() => onOpenChange(false)}
        >
          Demo Sign In
        </button>
      </div>
    </DialogContent>
  </Dialog>
);

export default AuthModal;
