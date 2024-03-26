import { revalidatePath, revalidateTag } from "next/cache";

async function getTime(
  timezone: string,
  cacheHeader: RequestCache = "force-cache"
) {
  const response = await fetch(
    `https://worldtimeapi.org/api/timezone/${timezone}`,
    {
      method: "GET",
      cache: cacheHeader,
      next: { tags: [timezone] },
    }
  );

  const data = await response.json();
  return data.datetime;
}

async function revalidateTimezone(timezone: string) {
  "use server";
  revalidateTag(timezone);
}

export default async function Home() {
  const revalidateNewYork = revalidateTimezone.bind(null, "America/New_York");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center">
        <p className="text-lg">
          The current time in New York is: {await getTime("America/New_York")}
        </p>
        <p className="text-lg">
          The current time in Los Angeles is:{" "}
          {await getTime("America/Los_Angeles")}
        </p>
        <p className="text-lg">
          The current time in Prague is:{" "}
          {await getTime("Europe/Prague", "no-store")}
        </p>
        <p className="text-2xl font-bold" id="time"></p>
      </div>

      <form action={revalidateNewYork}>
        <input type="text" name="name" />
        <button type="submit">Revalidate New York</button>
      </form>
    </main>
  );
}
