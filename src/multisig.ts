import { CryptoSys } from '@desig/supported-chains'
import { Connection } from './connection'
import type { MultisigEntity } from './types'

export class Multisig extends Connection {
  constructor(cluster: string, cryptosys: CryptoSys) {
    super(cluster, cryptosys)
  }

  /**
   * Fetch multisig data including signer data
   * @param id Multisig id
   * @returns Multisig data
   */
  getMultisig = async (id: string): Promise<MultisigEntity> => {
    const { data } = await this.connection.get<MultisigEntity>(
      `/multisig/${id}`,
    )
    return data
  }

  /**
   * Initialize a new multig
   * @param opt.t The t-out-of-n threshold
   * @param opt.n The t-out-of-n threshold
   * @param opt.pubkeys The list of member pubkeys
   * @returns Multisig data
   */
  initializeMultisig = async ({
    t,
    n,
    pubkeys,
  }: {
    t: number
    n: number
    pubkeys: string[]
  }): Promise<MultisigEntity> => {
    if (t < 1 || n < 1 || t > n)
      throw new Error(`Invalid threshold. Current (t,n)=(${t},${n}).`)
    if (pubkeys.length !== n)
      throw new Error(
        `Insufficient number of pubkeys. Should be equal to ${n}.`,
      )
    const { data } = await this.connection.post<MultisigEntity>('multisig', {
      t,
      n,
      pubkeys,
    })
    return data
  }
}
