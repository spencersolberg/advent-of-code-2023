export class System {
    workflows: Workflow[];
    parts?: Part[];

    constructor(input: string, useParts = true) {
        const [workflowsString, partsString] = input.split("\n\n");

        this.workflows = System.parseWorkflows(workflowsString);
        if(useParts) this.parts = System.parseParts(partsString);
    };

    static parseWorkflows(workflowsString: string): Workflow[] {
        const workflowRegex = /([a-z]+)\{([a-zAR0-9<>:,]+)\}/g;

        const workflows: Workflow[] = [];
        for (const line of workflowsString.split("\n")) {
            const [name, rulesString] = [...line.matchAll(workflowRegex)][0].slice(1, 3);
            const rules = System.parseRules(rulesString);

            workflows.push({ name, rules });
        }

        return workflows;
    };

    static parseRules(rulesString: string): WorkflowRule[] {
        const ruleRegex = /(x|m|a|s)(<|>)(\d+):([a-zAR]+)/g;

        const rules: WorkflowRule[] = [];
        for (const ruleString of rulesString.split(",")) {
            if (ruleString.includes(">") || ruleString.includes("<")) {
                const [categoryString, conditionString, valueString, destinationString] = [...ruleString.matchAll(ruleRegex)][0].slice(1, 5);

                let category: PartCategory;
                switch (categoryString) {
                    case "x": {
                        category = PartCategory.ExtremelyCoolLooking;
                        break;
                    }
                    case "m": {
                        category = PartCategory.Musical;
                        break;
                    }
                    case "a": {
                        category = PartCategory.Aerodynamic;
                        break;
                    }
                    case "s": {
                        category = PartCategory.Shiny;
                        break;
                    }
                    default: {
                        throw new Error(`Unrecognized category character: ${categoryString}`);
                    }
                }

                let condition: WorkflowRuleCondition;
                switch (conditionString) {
                    case "<": {
                        condition = WorkflowRuleCondition.LessThan;
                        break;
                    }
                    case ">": {
                        condition = WorkflowRuleCondition.GreaterThan;
                        break;
                    }
                    default: {
                        throw new Error(`Unrecognized condition character: ${conditionString}`);
                    }
                }

                const value = parseInt(valueString);

                let destination: WorkflowRuleDestination;
                switch (destinationString) {
                    case "A": {
                        destination = { type: "decision", decision: "accept" };
                        break;
                    }
                    case "R": {
                        destination = { type: "decision", decision: "reject" };
                        break;
                    }
                    default: {
                        destination = { type: "redirect", redirect: destinationString };
                    }
                }

                rules.push({ type: "test", category, condition, value, destination });
            } else {
                let destination: WorkflowRuleDestination;
                switch (ruleString) {
                    case "A": {
                        destination = { type: "decision", decision: "accept" };
                        break;
                    }
                    case "R": {
                        destination = { type: "decision", decision: "reject" };
                        break;
                    }
                    default: {
                        destination = { type: "redirect", redirect: ruleString };
                    }
                }
                
                rules.push({ type: "default", destination });
            }
        }

        return rules;
    }

    static parseParts(partsString: string): Part[] {
        const partRegex = /\{x=(\d+),m=(\d+),a=(\d+),s=(\d+)\}/g;

        const parts: Part[] = [];
        for (const line of partsString.split("\n")) {
            const [extremelyCoolLooking, musical, aerodynamic, shiny] = [...line.matchAll(partRegex)][0].slice(1, 5).map(val => parseInt(val));

            parts.push({
                extremelyCoolLooking,
                musical,
                aerodynamic,
                shiny,
            });
        }

        return parts;
    };

    public considerPart(part: Part): boolean {
        let currentWorkflow = this.workflows.find(workflow => workflow.name === "in")!;

        while (true) {
            for (const rule of currentWorkflow.rules) {
                if (rule.type === "test") {
                    let passed = false;
                    if (rule.condition === WorkflowRuleCondition.GreaterThan) {
                        switch (rule.category) {
                            case PartCategory.ExtremelyCoolLooking: {
                                passed = part.extremelyCoolLooking > rule.value;
                                break;
                            }
                            case PartCategory.Musical: {
                                passed = part.musical > rule.value;
                                break;
                            }
                            case PartCategory.Aerodynamic:
                                passed = part.aerodynamic > rule.value;
                                break;
                            case PartCategory.Shiny:
                                passed = part.shiny > rule.value;
                                break;
                        }
                        if (!passed) continue;
                    } else {
                        switch (rule.category) {
                            case PartCategory.ExtremelyCoolLooking: {
                                passed = part.extremelyCoolLooking < rule.value;
                                break;
                            }
                            case PartCategory.Musical: {
                                passed = part.musical < rule.value;
                                break;
                            }
                            case PartCategory.Aerodynamic: {
                                passed = part.aerodynamic < rule.value;
                                break;
                            }
                            case PartCategory.Shiny: {
                                passed = part.shiny < rule.value;
                                break;
                            }
                        }
                        if (!passed) continue;
                    }
                }

                if (rule.destination.type === "redirect") {
                    const { redirect } = rule.destination;
                    currentWorkflow = this.workflows.find(workflow => workflow.name === redirect)!;
                    break;
                } else {
                    switch (rule.destination.decision) {
                        case "accept": return true;
                        case "reject": return false;
                    }
                }
            }
        }
    }
};

type Workflow = {
    name: string;
    rules: WorkflowRule[];
};

type WorkflowRule = WorkflowRuleTest | WorkflowRuleDefault;

type WorkflowRuleTest = {
    type: "test";
    category: PartCategory;
    condition: WorkflowRuleCondition;
    value: number;
    destination: WorkflowRuleDestination;
}

type WorkflowRuleDefault = {
    type: "default";
    destination: WorkflowRuleDestination;
}

type WorkflowRuleDestinationRedirect = {
    type: "redirect";
    redirect: string;
}

type WorkflowRuleDestinationDecision = {
    type: "decision";
    decision: "accept" | "reject";
}

type WorkflowRuleDestination = WorkflowRuleDestinationRedirect | WorkflowRuleDestinationDecision;

enum PartCategory {
    ExtremelyCoolLooking = "x",
    Musical = "m",
    Aerodynamic = "a",
    Shiny = "s"
}

enum WorkflowRuleCondition {
    GreaterThan = ">",
    LessThan = "<"
}

export type Part = {
    extremelyCoolLooking: number;
    musical: number;
    aerodynamic: number;
    shiny: number;
}