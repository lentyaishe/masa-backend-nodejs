import { Request, Response, NextFunction } from 'express';
import { DemoHelper } from '../helpers/demo.helper';

const getHelloWorld = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
        message: "Hello world!"
    });
};

const getWithTimeout = async (req: Request, res: Response, next: NextFunction) => {
    setTimeout(() => {
        return res.status(200).json({
            message: "Timeout in 1 second"
        });
    }, 1000);
};

const getWithDoubleTimeout = (req: Request, res: Response, next: NextFunction) => {
    DemoHelper.doubleWait(5, 7)
        .then(() => {
            console.log("All complete");
            
            return res.status(200).json({
                message: "Double timeout"
            });
        })
        .catch((error) => {
            // handle me
        });
};

const getWithDoubleTimeoutChained = (req: Request, res: Response, next: NextFunction) => {
    DemoHelper.doubleWaitChainedPromise(5, 7)
        .then(() => {
            console.log("All complete");
            
            return res.status(200).json({
                message: "Double timeout chained"
            });
        })
        .catch((error) => {
            // handle me
        });
};

const getWithDoubleTimeoutParallel = (req: Request, res: Response, next: NextFunction) => {
    DemoHelper.doubleWaitParallel(5, 7)
        .then(() => {
            console.log("All complete");
            
            return res.status(200).json({
                message: "Double timeout chained"
            });
        })
        .catch((error) => {
            // handle me
        });
};

const getWithDelay = async (req: Request, res: Response, next: NextFunction) => {
    // Read the delay in seconds from request parameter
    let delayInSeconds: number = parseInt(req.params.seconds);

    DemoHelper.waitXSeconds(delayInSeconds)
        .then(() => {
            return res.status(200).json({
                message: `Timeout in ${delayInSeconds} second(s)`
            });
        })
        .catch((error) => {
            return res.sendStatus(400);
        });
};

const getWithDelayAsync = async (req: Request, res: Response, next: NextFunction) => {
    // Read the delay in seconds from request parameter
    let delayInSeconds: number = parseInt(req.params.seconds);

    try {
        await DemoHelper.waitXSecondsAsync(delayInSeconds);

        return res.status(200).json({
            message: `Timeout in ${delayInSeconds} second(s)`
        });
    }
    catch (error) {
        return res.sendStatus(400);
    }
};

const getWithDelayValidated = async (req: Request, res: Response, next: NextFunction) => {
    // Read the delay in seconds from request parameter
    const secondsStringParameter: string = req.params.seconds;
    if (isNaN(Number(secondsStringParameter))) {
        // Error response with an error message
        // return res.status(406).json({
        //     error: "Incorrect seconds parameter value"
        // });

        // Error reponse without a message
        return res.sendStatus(406);
    }
    else {
        // All is good: proceed
        let delayInSeconds: number = parseInt(req.params.seconds);
        setTimeout(() => {
            return res.status(200).json({
                message: `Timeout in ${delayInSeconds} second(s)`
            });
        }, delayInSeconds * 1000);
    }
};

export default { getHelloWorld, getWithTimeout, getWithDelay, getWithDelayAsync, getWithDelayValidated, getWithDoubleTimeout, getWithDoubleTimeoutChained, getWithDoubleTimeoutParallel };