import { execCommand } from "../lib/mockCommandInvoke";

describe("CodeGenerationTests", () => {
  // First clear the generated files if there are any
  // Then run the generate command for the whole section
  // After it ran successfully check the generated file contents and paths are correct

  it("Should run codegen command", async () => {
    const cmdExec = execCommand("echo", ["test"]);
    const { stdout, stderr, code } = await cmdExec;

    console.log(stdout);
    expect(stdout).toBe("test\n");
    expect(stderr).toBe("");
    expect(code).toBe(0);
  });
});
