import { execCommand } from "../lib/mockCommandInvoke";

describe("CodeGenerationTests", () => {
  // First clear the generated files if there are any
  // Then run the generate command for the whole section
  // After it ran successfully check the generated file contents and paths are correct

  it("Should run codegen command", async () => {
    const cmdExec = execCommand("npm run generate");
    const { stdout, stderr, code } = await cmdExec;

    const trimmedStdout = stdout.split("\n");

    expect(trimmedStdout[4]).toBe("Generate Core files");
    expect(stderr).toBe("");
    expect(code).toBe(0);
  });
});
