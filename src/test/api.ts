export const getUser = async (id: number) => {
  const res = await fetch(`/api/user/${id}`);
  return res.json();
};

export const sendLog = (msg: string) =>
  fetch('/log', {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: JSON.stringify({ msg }),
  });
