import { HttpModule, HttpService } from '@nestjs/axios';
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { ZuluApiHealthIndicator } from './zulu-api.health';
import { ZuluApiService } from './zulu-api.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('ZULU_URL'),
        withCredentials: true,
      }),
      inject: [ConfigService],
    }),
    TerminusModule,
  ],
  providers: [ZuluApiService, ZuluApiHealthIndicator],
  exports: [ZuluApiService, ZuluApiHealthIndicator],
})
export class ZuluApiModule extends HttpModule implements OnModuleInit {
  constructor(
    private readonly httpService: HttpService,
    private readonly zuluApiService: ZuluApiService,
  ) {
    super();
  }

  //Start zulu api authentication
  async onModuleInit() {
    const axios = this.httpService.axiosRef;

    let authData = await this.zuluApiService.authenticate();

    axios.interceptors.request.use((config) => {
      config.headers.Cookie = `session_id=${authData.result.session_id}`;
      return config;
    });

    axios.interceptors.response.use(undefined, async (error) => {
      if (
        error.response &&
        error.response.status >= 404 &&
        error.response.status < 500
      ) {
        // If the error is a client error (4xx) or a server error (5xx) except 404
        authData = await this.zuluApiService.authenticate(); // Re-authenticate and log
        error.config.headers.Cookie = `session_id=${authData.result.session_id}`; // Update the session_id
        return axios.request(error.config); // Retry the request
      }
      return Promise.reject(error);
    });
  }
}
