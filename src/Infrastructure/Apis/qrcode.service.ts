// Step 1: Import the parts of the module you want to use
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { BaseHttpRequestService } from './api.service';

interface IBody {
  description: string;
  external_reference: string;
  title: string;
  total_amount: number;
}

interface IResponse {
  qr_data: string;
  in_store_order_id: string;
}

@Injectable()
export class QRCodeService extends BaseHttpRequestService {
  async create(body: IBody): Promise<AxiosResponse<IResponse>> {
    try {
      return await this.request({
        method: 'POST',
        data: body,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
