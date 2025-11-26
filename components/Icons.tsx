import React from 'react';

export const UpvoteIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-11.293a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414l-3-3z" clipRule="evenodd" />
  </svg>
);

export const XIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const NftIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.75 1.512a.75.75 0 01.52.525l1.896 5.862a.75.75 0 00.526.526l5.862 1.896a.75.75 0 010 1.042l-5.862 1.896a.75.75 0 00-.526.526l-1.896 5.862a.75.75 0 01-1.042 0l-1.896-5.862a.75.75 0 00-.526-.526L.92 11.25a.75.75 0 010-1.042l5.862-1.896a.75.75 0 00.526-.526L9.2 2.037a.75.75 0 011.042 0l.508.508z" />
  </svg>
);

export const XpIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v.255a13.43 13.43 0 013.91 3.515l.23-.23a.75.75 0 111.06 1.06l-.23.23a13.43 13.43 0 013.515 3.91h.255a.75.75 0 010 1.5h-.255a13.43 13.43 0 01-3.515 3.91l.23.23a.75.75 0 11-1.06 1.06l-.23-.23a13.43 13.43 0 01-3.91 3.515v.255a.75.75 0 01-1.5 0v-.255a13.43 13.43 0 01-3.91-3.515l-.23.23a.75.75 0 11-1.06-1.06l.23-.23a13.43 13.43 0 01-3.515-3.91H2a.75.75 0 010-1.5h.255a13.43 13.43 0 013.515-3.91l-.23-.23a.75.75 0 011.06-1.06l.23.23A13.43 13.43 0 019.25 3.005V2.75A.75.75 0 0110 2zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
  </svg>
);

export const MagicWandIcon = ({ className, ...props }: { className?: string, style?: React.CSSProperties }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M10.25 2.5a.75.75 0 00-1.5 0v1.313a.75.75 0 00.353.646l2.147 1.24a.75.75 0 00.758-1.292L10.25 3.813V2.5zM3.813 10.25a.75.75 0 00-1.293-.758L1.27 11.64a.75.75 0 00.647.354h1.312a.75.75 0 000-1.5H2.5v-1.75zM10 12.25a.75.75 0 00-.75.75v4.25a.75.75 0 001.5 0v-4.25a.75.75 0 00-.75-.75zM16.187 10.25a.75.75 0 001.293.758l1.25-2.147a.75.75 0 00-.647-.353h-1.312a.75.75 0 000 1.5h1.75v1.75zM8.75 8a.75.75 0 00-1.5 0v.105a1.75 1.75 0 01-1.75 1.75H5a.75.75 0 000 1.5h.605a1.75 1.75 0 011.75 1.75v.105a.75.75 0 001.5 0v-.105a1.75 1.75 0 011.75-1.75h.105a.75.75 0 000-1.5h-.105a1.75 1.75 0 01-1.75-1.75V8z" />
        <path fillRule="evenodd" d="M10.843 3.332a.75.75 0 00-1.06 1.06l.764.764a4.5 4.5 0 012.862 5.644l.764.764a.75.75 0 101.06-1.06l-.764-.764a6 6 0 00-3.812-7.532zM3.332 9.157a.75.75 0 10-1.06 1.06l.764.764a4.5 4.5 0 015.644 2.862l.764.764a.75.75 0 101.06-1.06l-.764-.764a6 6 0 00-7.532-3.812z" clipRule="evenodd" />
    </svg>
);

export const LoaderIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const CloseIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const ShareIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M13 4.5a2.5 2.5 0 11.702 4.281l-4.236 2.42a2.502 2.502 0 010 1.598l4.236 2.42a2.5 2.5 0 11-.701 1.218L8.298 14.22a2.5 2.5 0 110-3.44l4.236-2.42A2.5 2.5 0 0113 4.5z" />
    </svg>
);

export const TrashIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
  </svg>
);

export const TelegramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 .056 12 12 0 0 0 11.944 0zm5.228 8.412-2.115 9.94a.79.79 0 0 1-1.52.093L9.9 13.112l-2.431-1.187a.78.78 0 0 1 .076-1.488l10.53-4.043a.78.78 0 0 1 .98.92z" />
  </svg>
);

export const MenuIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const CopyIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

export const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export const SendIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M3.105 3.105a.75.75 0 01.884-.043l11.98 7.188a.75.75 0 010 1.302L3.99 16.938a.75.75 0 01-1.302-.884l1.83-5.49a.75.75 0 000-.548L2.688 4.03a.75.75 0 01.417-1.002z" />
    </svg>
);
