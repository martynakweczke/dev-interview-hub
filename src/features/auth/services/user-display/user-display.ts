export type DisplayUser = {
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  email: string | null;
};

const FALLBACK_NAME = "Account";

function clean(value: string | null): string {
  return value?.trim() ?? "";
}

export function getDisplayName(user: DisplayUser): string {
  const firstName = clean(user.firstName);

  if (firstName) {
    return firstName;
  }

  const username = clean(user.username);

  if (username) {
    return username;
  }

  const emailName = clean(user.email).split("@")[0];

  if (emailName) {
    return emailName;
  }

  return FALLBACK_NAME;
}

export function getInitials(user: DisplayUser): string {
  const first = clean(user.firstName);
  const last = clean(user.lastName);

  if (first && last) {
    return (first[0] + last[0]).toUpperCase();
  }

  return getDisplayName(user).slice(0, 2).toUpperCase();
}
