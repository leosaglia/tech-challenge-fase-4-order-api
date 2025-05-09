import { InvalidDocumentError } from '@core/enterprise/custom-exceptions/invalid-document'

export class Document {
  private readonly value: string

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new InvalidDocumentError('Invalid document.')
    }
    this.value = value.replace(/\D/g, '')
  }

  private isValid(value: string): boolean {
    // Remove caracteres não numéricos
    const cpf = value.replace(/\D/g, '')

    // Verifica se o CPF tem 11 dígitos
    if (cpf.length !== 11) {
      return false
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) {
      return false
    }

    // Validação dos dígitos verificadores
    let sum = 0
    let remainder

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i)
    }

    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) {
      remainder = 0
    }
    if (remainder !== parseInt(cpf.substring(9, 10))) {
      return false
    }

    sum = 0
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i)
    }

    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) {
      remainder = 0
    }
    if (remainder !== parseInt(cpf.substring(10, 11))) {
      return false
    }

    return true
  }

  public getValue(): string {
    return this.value
  }
}
