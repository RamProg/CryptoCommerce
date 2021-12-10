import autocannon from "autocannon";
import { PassThrough } from "stream";

function run(url) {
  const buf: any = [];
  const outpuStream = new PassThrough();

  const inst = autocannon({
    url,
    connections: 100,
    duration: 20,
  });

  autocannon.track(inst, { outpuStream });

  outpuStream.on("data", (data) => buf.push(data));
  inst.on("done", function () {
    process.stdout.write(Buffer.concat(buf));
  });
}

run("https://localhost:8080/info");
