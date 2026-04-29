import MessagePage from "@/global/MessagePage";
import { Suspense } from "react";

export default function Messages() {
  return(
  <Suspense fallback={<div>Loading messages...</div>}>
    <MessagePage />
  </Suspense>
  )
}
