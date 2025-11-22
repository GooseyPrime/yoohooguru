// Global type declarations for Next.js styled-jsx support

declare namespace React {
  interface StyleHTMLAttributes<T> extends HTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
}
