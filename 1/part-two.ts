const input = await Deno.readTextFile("input.txt");

const separateNumbers = (line: string): string[] => {
    const regex =
        /(?=([0-9]|one|two|three|four|five|six|seven|eight|nine|zero))/g;

    const matches = [...line.matchAll(regex)].map((match) => match[1]);
    console.log({ line, matches });

    return matches;
};

const numerify = (numberStrings: string[]): number[] => {
    const numbers: number[] = [];
    for (const numberString of numberStrings) {
        numbers.push(parseInt(
            numberString
                .replace("one", "1")
                .replace("two", "2")
                .replace("three", "3")
                .replace("four", "4")
                .replace("five", "5")
                .replace("six", "6")
                .replace("seven", "7")
                .replace("eight", "8")
                .replace("nine", "9")
                .replace("zero", "0"),
        ));
    }

    return numbers;
};

let sum = 0;

for (const line of input.split("\n")) {
    const separatedNumbers = separateNumbers(line);
    const digits = numerify(separatedNumbers);
    const first = digits[0];
    const last = digits[digits.length - 1];

    if (first === undefined || last === undefined) {
        continue;
    }

    const value = parseInt(`${first}${last}`);
    sum += value;
}

console.log(sum);
