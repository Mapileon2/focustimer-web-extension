import React from 'react';

const ShareIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 4.186m0-4.186c.114.058.22.124.32.196m-1.48 3.792a2.25 2.25 0 10-2.25 2.25M7.217 10.907V7.875a2.25 2.25 0 114.5 0v3.032m0 0a2.25 2.25 0 100 4.186m0-4.186a2.25 2.25 0 00-4.5 0m4.5 0v3.032a2.25 2.25 0 002.25 2.25h1.5a2.25 2.25 0 100-4.5h-1.5a2.25 2.25 0 00-2.25 2.25z" />
    </svg>
);

export default ShareIcon;
