import React from 'react';
import type { SVGProps } from 'react';

export const UserAccount = (props: SVGProps<SVGSVGElement>) => {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={ props.width ?? "1em" } height={ props.width ?? "1em" } viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} color="currentColor"><path d="M14 9h4m-4 3.5h3"></path><rect width={20} height={18} x={2} y={3} rx={5}></rect><path d="M5 16c1.208-2.581 5.712-2.75 7 0m-1.5-7a2 2 0 1 1-4 0a2 2 0 0 1 4 0"></path></g></svg>);
};
export const WorkSpaceIcon = (props: SVGProps<SVGSVGElement>) => {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={ props.width ?? "1em" } height={ props.width ?? "1em" } viewBox="0 0 24 24" {...props}><path fill="currentColor" d="m12 11.925l-1.7 1.3q-.15.125-.3.013t-.1-.288l.65-2.1l-1.75-1.4q-.125-.125-.075-.287T8.95 9h2.15l.65-2.05q.05-.175.25-.175t.25.175L12.9 9h2.125q.175 0 .238.163t-.063.287l-1.775 1.4l.65 2.1q.05.175-.1.288t-.3-.013zM12 21l-4.675 1.55q-.5.175-.913-.125t-.412-.8v-6.35q-.95-1.05-1.475-2.4T4 10q0-3.35 2.325-5.675T12 2t5.675 2.325T20 10q0 1.525-.525 2.875T18 15.275v6.35q0 .5-.413.8t-.912.125zm0-5q2.5 0 4.25-1.75T18 10t-1.75-4.25T12 4T7.75 5.75T6 10t1.75 4.25T12 16m-4 4.025L12 19l4 1.025v-3.1q-.875.5-1.888.788T12 18t-2.113-.288T8 16.926zm4-1.55"></path></svg>);
};
