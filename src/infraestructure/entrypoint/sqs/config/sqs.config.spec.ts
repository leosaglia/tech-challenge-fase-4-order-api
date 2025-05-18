import { describe, it, expect, vi, beforeEach } from 'vitest'
import SqsClient from './sqs.config'
import {
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from '@aws-sdk/client-sqs'

vi.mock('@aws-sdk/client-sqs', () => {
  return {
    SQSClient: vi.fn().mockImplementation(() => ({ send: vi.fn() })),
    SendMessageCommand: vi.fn(),
    ReceiveMessageCommand: vi.fn(),
    DeleteMessageCommand: vi.fn(),
  }
})

function getSendMock(sqsClient: SqsClient) {
  return (
    sqsClient as unknown as { client: { send: ReturnType<typeof vi.fn> } }
  ).client.send
}

describe('SqsClient', () => {
  let sqsClient: SqsClient
  let sendMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    sqsClient = new SqsClient()
    sendMock = getSendMock(sqsClient)
    sendMock.mockReset()
  })

  it('should send a message to the queue', async () => {
    sendMock.mockResolvedValueOnce(undefined)
    await expect(
      sqsClient.sendMessage('url', { foo: 'bar' }),
    ).resolves.toBeUndefined()
    expect(SendMessageCommand).toHaveBeenCalledWith({
      QueueUrl: 'url',
      MessageBody: JSON.stringify({ foo: 'bar' }),
    })
    expect(sendMock).toHaveBeenCalled()
  })

  it('should throw error if sendMessage fails', async () => {
    sendMock.mockRejectedValueOnce(new Error('fail'))
    await expect(sqsClient.sendMessage('url', { foo: 'bar' })).rejects.toThrow(
      'fail',
    )
  })

  it('should receive and parse messages from the queue', async () => {
    sendMock.mockResolvedValueOnce({
      Messages: [
        { Body: JSON.stringify({ foo: 1 }), ReceiptHandle: 'abc' },
        { Body: JSON.stringify({ bar: 2 }), ReceiptHandle: 'def' },
      ],
    })
    const result = await sqsClient.receiveMessages<{
      foo?: number
      bar?: number
    }>('url')
    expect(ReceiveMessageCommand).toHaveBeenCalledWith({
      QueueUrl: 'url',
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20,
    })
    expect(result).toEqual([
      { message: { foo: 1 }, receiptHandles: 'abc' },
      { message: { bar: 2 }, receiptHandles: 'def' },
    ])
  })

  it('should return empty array if receiveMessages fails', async () => {
    sendMock.mockRejectedValueOnce(new Error('fail'))
    const result = await sqsClient.receiveMessages('url')
    expect(result).toEqual([])
  })

  it('should delete a message from the queue', async () => {
    sendMock.mockResolvedValueOnce(undefined)
    await expect(
      sqsClient.deleteMessage('url', 'handle'),
    ).resolves.toBeUndefined()
    expect(DeleteMessageCommand).toHaveBeenCalledWith({
      QueueUrl: 'url',
      ReceiptHandle: 'handle',
    })
    expect(sendMock).toHaveBeenCalled()
  })

  it('should throw error if deleteMessage fails', async () => {
    sendMock.mockRejectedValueOnce(new Error('fail'))
    await expect(sqsClient.deleteMessage('url', 'handle')).rejects.toThrow(
      'fail',
    )
  })
})
