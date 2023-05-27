import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: "recoil-persist-atom",
  storage: sessionStorage,
  // storage: localStorage,
});

export const VertportInfoState = atom({
  key: "verportInfoState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const getAdminLoginState = selector({
  key: "getAdminLoginState",
  get: ({ get }) => {
    const data = get(VertportInfoState);
    return data.state;
  },
});
