'use client';

export default function LoadingScreen() {
  return (
    <div className="ml-auto mr-auto flex h-screen flex-col items-center justify-center">
      <img src="/coralLoad.gif" />
      <p className="animate-pulse text-xl font-medium text-gray-900">
        Loading...
      </p>
    </div>
  );
}
