import React, { useState, useEffect, useRef } from 'react';
import * as Toast from '@radix-ui/react-toast';

interface ToastProps {
  message: string;
  duration?: number;
}

export default function ToastComp({ message, duration = 5000 }: ToastProps) {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const eventDateRef = useRef(new Date());
  const timerRef = useRef(0);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration]);

  return (
    <Toast.Root open={open} onOpenChange={setOpen}>
      <Toast.Title>No</Toast.Title>
      <Toast.Description asChild>
        <time dateTime={eventDateRef.current.toISOString()}>
          {eventDateRef.current.toLocaleString()}
        </time>
      </Toast.Description>
      <Toast.Action asChild altText="Goto schedule to undo">
        <button>Undo</button>
      </Toast.Action>
    </Toast.Root>
  );
}
