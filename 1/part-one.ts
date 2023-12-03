const input = await Deno.readTextFile("input.txt");

const digitsOnly = input.replaceAll(/[a-z]*/g, "")

let sum = 0

for (const line of digitsOnly.split("\n")) {
    const digits = line.split("");
    const first = digits[0];
    const last = digits[digits.length - 1];

    if (first === undefined || last === undefined) {
        continue;
    }

    sum += parseInt(`${first}${last}`)
}

console.log(sum)