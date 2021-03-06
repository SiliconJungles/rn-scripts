import {spawn, spawnSync, SpawnSyncOptions, SpawnSyncReturns} from 'child_process'

export default class Arg {

	/**
	 * Returns the first argument value (process.argv[2])
	 * @throws {Error} when accepted_values does not contain argument
	 */
	static v_first_enum(accepted_values: string[]): string {
		let command = process.argv[2]
		let abc = accepted_values.find((it)=>{
			return it.toLowerCase() === command?.toLowerCase() ?? false
		})
		if (abc) return command
		else throw Error(`Invalid command: ${command}. Accepted commands: ${accepted_values}`)
	}

	/**
	 * Returns the value for a specified key
	 * @throws {Error} when accepted_values does not contain argument
	 */
	static v_enum(key: string, accepted_values: string[]): string {
		let value = this.v(key)
		let abc = accepted_values.find((it)=>{
			return it.toLowerCase() === value.toLowerCase()
		})
		if (abc) return value
		else throw Error(`Invalid value: ${value}. Accepted values: ${accepted_values}`)
	}

	/**
	 * Returns the value for a specified key, or undefined if it cannot be found
	 * @throws {Error} when accepted_values does not contain argument
	 */
	static v_enum_null(key: string, accepted_values: string[]): string | undefined {
		let value: string | undefined = this.v_null(key)
		if (value === undefined) return value

		let find = accepted_values.find((it)=>{
			// @ts-ignore value should always be string
			return it.toLowerCase() === value.toLowerCase()
		})
		if (find) return value
		else throw Error(`Invalid value: ${value}. Accepted values: [${accepted_values}]`)
	}

	/**
	 * Returns the value for a specified key
	 * @throws {Error} if no value can be found for that key
	 */
	static v(key: string): string {
		let value: string | number | boolean | null = null
		process.argv.forEach((arg: string, index: number, array) => {
			let k = arg.split(':')[0]
			let v = arg.split(':')[1]
			if (k.toLowerCase() === key) {
				value = v
			}
		})
		if (value) return value
		else throw Error(`Required parameter '${key}' not found. Please re-run command with '${key}:[value]'`)
	}

	/**
	 * Returns the value for a specified key, or undefined if it cannot be found
	 */
	static v_null(key: string): string | undefined {
		let value: string | number | boolean | undefined = undefined
		process.argv.forEach((arg: string, index: number, array) => {
			let k = arg.split(':')[0]
			let v = arg.split(':')[1]
			if (k.toLowerCase() === key) {
				value = v
			}
		})
		return value
	}

	/**
	 * Returns the numeric value for a specified key
	 * @throws {TypeError} if value is not a valid number
	 */
	static v_number(key: string): number {
		let value = this.v(key)
		let number
		try {
			number = parseInt(value)
			return number
		} catch(e) {
			throw TypeError(`${key}:${value} must be a number.`)
		}
	}

	/**
	 * Returns the numeric value for a specified key, or undefined if it cannot be found
	 * @throws {TypeError} if value is not a valid number
	 */
	static v_number_null(key: string): number | undefined {
		let value = this.v_null(key)
		if (value == null) return undefined
		let number
		try {
			number = parseInt(value)
			return number
		} catch(e) {
			throw TypeError(`${key}:${value} must be a number.`)
		}
	}
}
