import { NextApiRequest, NextApiResponse } from 'next'
import { handlers } from '../../auth';

export const { GET, POST } = handlers;
