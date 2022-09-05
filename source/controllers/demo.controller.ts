import { Request, Response, NextFunction } from 'express';

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

const getWithDelay = async (req: Request, res: Response, next: NextFunction) => {
    // Read the delay in seconds from request parameter
    let delayInSeconds: number = parseInt(req.params.seconds);

    setTimeout(() => {
        return res.status(200).json({
            message: `Timeout in ${delayInSeconds} second(s)`
        });
    }, delayInSeconds * 1000);
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

export default { getHelloWorld, getWithTimeout, getWithDelay, getWithDelayValidated };