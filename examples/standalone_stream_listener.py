import time
from rich.console import Console
from rich.table import Table
from src.analyzer.round_level_detector import RoundLevelDetector

console = Console()

def main():
    console.print("[bold cyan]🎯 QUOTEX ROUND NUMBER SNR TRACKER : STANDALONE LISTENER[/bold cyan]")
    console.print("[dim]Simulating real-time Reverse-Engineered Binary Protocol stream ticks...[/dim]\n")
    
    detector = RoundLevelDetector()
    test_prices = [1.08480, 1.08492, 1.08500, 1.08520, 1.08545, 1.08550, 1.08580]
    
    table = Table(title="Detected Psychological Price Levels")
    table.add_column("Time", style="cyan")
    table.add_column("Price", style="bold")
    table.add_column("Level Classification", style="magenta")
    table.add_column("Winrate Probability", justify="right")
    table.add_column("Action Alert", style="bold green")
    
    for p in test_prices:
        res = detector.inspect_price(p)
        action = "[bold green]BUY REVERSAL[/bold green]" if res["level_type"] != "NONE" else "[dim]HOLD[/dim]"
        table.add_row(
            time.strftime("%H:%M:%S"),
            f"{p:.5f}",
            res["level_type"],
            f"{int(res['reversal_probability'] * 100)}%",
            action
        )
    
    console.print(table)
    console.print("\n[bold green]✓ Standalone SNR listener demo completed successfully![/bold green]")

if __name__ == "__main__":
    main()
