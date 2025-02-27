import environment from "./config";
import { connect, Contract, keyStores, WalletConnection } from "near-api-js";
import { formatNearAmount } from "near-api-js/lib/utils/format";

const nearEnv = environment("testnet");

export async function initializeContract() {
 const near = await connect(
    Object.assign(
      { deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } },
      nearEnv,
      {
        walletUrl: "https://testnet.mynearwallet.com/", // Updated wallet URL
      }
    )
 );
 window.walletConnection = new WalletConnection(near);
 window.accountId = window.walletConnection.getAccountId();
 window.contract = new Contract(
    window.walletConnection.account(),
    nearEnv.contractName,
    {
      // List here all view methods
      viewMethods: ["getMeal", "getMeals", "getUserOrders", "getOrderInfo"],
      // List call methods that change state
      changeMethods: ["addNewMeal", "placeOrder", "deleteOrder"],
    }
 );
}

export async function accountBalance() {
 return formatNearAmount(
    (await window.walletConnection.account().getAccountBalance()).total,
    2
 );
}

export async function getAccountId() {
 return window.walletConnection.getAccountId();
}

export function login() {
 window.walletConnection.requestSignIn(nearEnv.contractName);
}

export function logout() {
 window.walletConnection.signOut();
 window.location.reload();
}
