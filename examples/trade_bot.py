import asyncio
from pyquotex.config import credentials
from pyquotex.stable_api import Quotex

email, password = credentials()

client = Quotex(
    email=email,
    password=password,
    lang="pt"
)

ASSET = "AUDCAD"
MONITOR_DURATION = 60


async def analyze_sentiment(asset_name, duration):
    print(f"\nMonitoring: {asset_name}")

    for _ in range(duration * 2):
        try:
            market_mood = await client.get_realtime_sentiment(
                asset_name
            )

            sentiment = market_mood.get("sentiment")

            if sentiment:
                sell = sentiment.get("sell", 0)
                buy = sentiment.get("buy", 0)

                print(
                    f"\rSell: {sell} | Buy: {buy}",
                    end=""
                )

        except Exception as error:
            print(f"\nSentiment error: {error}")

        await asyncio.sleep(0.5)

    print("\nMonitoring completed.")


async def monitor_market():
    connected, message = await client.connect()
    print(message)

    if not connected:
        print("Could not connect to Quotex.")
        return

    try:
        asset_name, asset_data = await client.get_available_asset(
            ASSET,
            force_open=False
        )

        if asset_data is None or not asset_data[2]:
            print(f"Asset {ASSET} is closed.")
            return

        print(f"Asset {asset_name} is open.")

        while True:
            await analyze_sentiment(
                asset_name,
                MONITOR_DURATION
            )

            await asyncio.sleep(2)

    finally:
        client.close()


async def main():
    try:
        await monitor_market()
    except Exception as error:
        print("Bot error:", error)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nBot stopped.")
