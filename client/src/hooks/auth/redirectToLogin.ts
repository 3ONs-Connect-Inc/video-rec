type NavigateFn = (path: string) => void;

export const redirectToLoginWithReturnUrl = (
  navigate: NavigateFn,
  currentPath: string
) => {
  const encodedPath = encodeURIComponent(currentPath);
  navigate(`/sign-in?returnTo=${encodedPath}`);
};
