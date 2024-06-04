import { AppError } from "@src/errors/AppError";
import { saveTokenToDbIfExistUpdate } from "@src/models/CustomerTokenModel";
import { getEnv } from "@src/utils/getEnv";
import { formatTimeInWordsWithUnit } from "@src/utils/formatTimeInWordsWithUnit";
import CryptoTokenSvs from "./cryptoTokenSvs";
import EmailSvs from "./mailSvs";
import { EncryptedDataInToken, VerificationEmailResponse } from "@src/Types";

/**
 * Sends a Verification email, generates a crypto token with encrypted userId in it and
 * saves token to DB if the resend time limit has not been exceeded.
 * @param {string} email The email address of the user.
 * @param {number} userId The ID of the user.
 * @return { object } An object containing a message, error flag, and status code.
 */

const sendVerificationEmailAndSaveTokenIfResendTimeLimitNotExceeded = async ( email: string, userId: number ): Promise<
    VerificationEmailResponse> => {
  const tokenType = "EMAIL_VERIFICATION";
  const token_resend_time = getEnv("RESEND_VERIFICATION_EMAIL_TIME");

  const _isTokenResendEligible = await CryptoTokenSvs.isTokenResendEligible(
      userId,
      tokenType,
      token_resend_time,
  );
  const formatedResendTime = formatTimeInWordsWithUnit(token_resend_time);

  if (!_isTokenResendEligible) {
    return {
      msg: `Verification Email already sent. Try again after ${formatedResendTime}`,
      error: true,
      statusCode: 409,
    };
  }

  const token = CryptoTokenSvs.generateCryptoTokenAndEncryptData<EncryptedDataInToken>({ userId });
  if (!token) throw new AppError("Token generation failed", 500);

  const msg = EmailSvs.sendVerificationEmail(email, token);
  await saveTokenToDbIfExistUpdate(token, userId, tokenType);

  return {
    token: encodeURIComponent(token),
    msg,
    error: false,
    statusCode: 200,
  };
};

export { sendVerificationEmailAndSaveTokenIfResendTimeLimitNotExceeded };
