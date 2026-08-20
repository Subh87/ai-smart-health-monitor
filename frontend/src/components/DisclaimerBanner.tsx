import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-200 px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-between gap-3 my-3">
      <div className="flex items-center gap-2.5">
        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
        <span>
          <strong className="font-semibold text-amber-300">Educational Prototype Notice:</strong> This device and application are intended solely for educational demonstration and are <strong className="underline decoration-amber-400">NOT medical diagnostic tools</strong>.
        </span>
      </div>
    </div>
  );
};
