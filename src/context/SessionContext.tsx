import constate from "constate";
import useSessionContext from "@/context/useSessionContext";

const [SessionProvider, useSession] = constate(useSessionContext);

export { SessionProvider, useSession };
