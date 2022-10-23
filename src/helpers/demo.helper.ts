export class DemoHelper {

    public static async waitXSecondsAsync(seconds: number): Promise<void> {
        console.log(`${DemoHelper.timeStamp()}: Starting delay`);
        await setTimeout(() => {
            console.log(`${DemoHelper.timeStamp()}: Delay complete`);
            return;
        }, seconds);
    }
    
    public static waitXSeconds(seconds: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, seconds * 1000);
        });
    }

    public static doubleWait(seconds1: number, seconds2: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`${DemoHelper.timeStamp()}: Execution start`);

            DemoHelper.waitXSeconds(seconds1)
                .then(() => {
                    console.log(`${DemoHelper.timeStamp()}: Waited ${seconds1} second(s)`);

                    DemoHelper.waitXSeconds(seconds2)
                        .then(() => {
                            console.log(`${DemoHelper.timeStamp()}: Waited ${seconds2} second(s)`);

                            resolve();
                        })
                        .catch((error) => {
                            reject(error);
                        });
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    public static doubleWaitChainedPromise(seconds1: number, seconds2: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`${DemoHelper.timeStamp()}: Execution start`);

            // 1 promise
            DemoHelper.waitXSeconds(seconds1)
                .then(() => {
                    // 1st promise returned success
                    console.log(`${DemoHelper.timeStamp()}: Waited ${seconds1} second(s)`);

                    // 2nd promise
                    return DemoHelper.waitXSeconds(seconds2);
                })
                .then(() => {
                    // 2nd promise returned success
                    console.log(`${DemoHelper.timeStamp()}: Waited ${seconds2} second(s)`);

                    resolve();
                })
                .catch((error) => {
                    // No matter 1st promise or 2nd promise fails => this catch will be fired
                    reject(error);
                });
        });
    }

    public static doubleWaitParallel(seconds1: number, seconds2: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`${DemoHelper.timeStamp()}: Execution start`);

            Promise.all([
                DemoHelper.waitXSeconds(seconds1)
                    .then(() => {
                        console.log(`${DemoHelper.timeStamp()}: Waited ${seconds1} second(s)`);
                    }),
                DemoHelper.waitXSeconds(seconds2)
                    .then(() => {
                        console.log(`${DemoHelper.timeStamp()}: Waited ${seconds2} second(s)`);
                    })
            ])
                .then(() => {
                    console.log(`${DemoHelper.timeStamp()}: Execution complete`);

                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    private static timeStamp(): string {
        return new Date().toTimeString();
    }
}