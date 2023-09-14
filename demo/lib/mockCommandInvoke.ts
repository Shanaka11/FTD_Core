import { spawn } from "child_process";

export const execCommand = async (
  command: string,
  params?: string[],
): Promise<{ stdout: string; stderr: string; code: number }> => {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, params, {
      shell: true,
    });

    let stdout = "";
    childProcess.stdout.on("data", (data) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      stdout = stdout + data.toString();
    });

    let stderr = "";
    childProcess.stderr.on("data", (data) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      stderr = stderr + data.toString();
    });

    childProcess.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr, code });
      } else {
        reject(new Error(stderr.trim()));
      }
    });

    childProcess.on("error", (err) => {
      reject(err);
    });
  });
};
